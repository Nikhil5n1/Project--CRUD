const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// Connect to the database
const sequelize = new Sequelize('headlesscms', 'root', '143Cr7NN1@', {
  dialect: 'mysql', // or 'postgres'
  host: 'localhost'
});

// Define Entity model
const Entity = sequelize.define('Entity', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    timestamps: false
});

// Define Attribute model
const Attribute = sequelize.define('Attribute', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    timestamps: false
});


// Define relationship between Entity and Attribute
Entity.hasMany(Attribute);
Attribute.belongsTo(Entity);

// Synchronize the models with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Error creating database tables:', err));

// Routes

// Create entity
app.post('/api/entity', async (req, res) => {
  try {
    const { name, attributes } = req.body; // form, input field
    const entity = await Entity.create({ name });

    console.log("attributes\n", attributes);

    const tableName = name.toLowerCase() + "s";

    if(Entity.findOne({where: { name }})) {
      return res.status(200).send("Entity Already exists");
    }

    for (const attr of attributes) {
      await Attribute.create({ name: attr.name, type: attr.type, EntityId: entity.id }); // [{}]
    }

    res.json({ message: 'Entity created successfully!' });
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({ error: 'Failed to create entity' });
  }
});

// Read all entities
app.get('/api/entities', async (req, res) => {
  try {
    const entities = await Entity.findAll({ include: [Attribute] });
    res.json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// get data for each entity
app.get("/api/dataOfEntity/:entityName", async(req, res) => {
  try {
    const entity = req.params.entityName;
    const tableName = entity.toLowerCase() + "s";
    
    const query = `SELECT * FROM ${tableName}`;
    const [dataValues] = await sequelize.query(query);
    
    res.json(dataValues);
  }
  catch (error) {
    console.log("something happened when fetching dataEntries:", error.message);
  }
});

app.get("/api/columnsAndValues/:entityName", async(req, res) => {
  try {
    const entityName = req.params.entityName.toLowerCase() + "s";
    const query = `SELECT column_name FROM information_schema.columns WHERE table_name = "${entityName}" AND column_name NOT IN ("entityId", "createdAt", "updatedAt");`;
    
    const [columns] = await sequelize.query(query);

    // Iterate through columns to fetch distinct values for each column
    const dataValues = [];
    for (const column of columns) {
        const columnName = column.COLUMN_NAME;
        const distinctValuesQuery = `SELECT DISTINCT ${columnName} FROM ${entityName};`;
        const [valuesResult] = await sequelize.query(distinctValuesQuery);
        const values = valuesResult.map(row => row[columnName]);
        dataValues.push({ COLUMN_NAME: columnName, values });
    }

    res.json(dataValues);
  }
  catch(error) {
    console.log(error.message);
  }
});


app.post("/api/createTable/:entityName", async (req, res) => {
  const entityName = req.params.entityName;
  const { attributes } = req.body;

  if (!entityName || !attributes || !Array.isArray(attributes)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const tableName = entityName.toLowerCase() + "s";

  try {
    // Find the entity to get the entityId
    const entity = await Entity.findOne({ where: { name: entityName } });
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    const entityId = entity.id;

    // Prepare the columns for the new table
    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      }
    };

    attributes.forEach(attr => {
      // Ensure attr.type is a valid Sequelize data type
      const dataType = DataTypes[attr.type];
      if (dataType) {
        columns[attr.name] = {
          type: dataType,
          allowNull: attr.allowNull !== undefined ? attr.allowNull : true,
        };
      } else {
        throw new Error(`Invalid data type: ${attr.type}`);
      }
    });

    // Add the entityId column at the end
    columns.entityId = {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: entityId,
    };

    // Create the new table using raw SQL query
    await sequelize.getQueryInterface().createTable(tableName, columns);

    res.status(201).json({ message: `Table ${tableName} created successfully` });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create data for an entity
// app.post('/api/data/:entityName', async (req, res) => {
//   const entityName = req.params.entityName;
//   const data = req.body; // JSON input // form -> input fields

// });

app.post('/api/data/:entityName', async (req, res) => {
  const entityName = req.params.entityName;
  const data = req.body; // JSON input // form -> input fields
  console.log("data =", data);

  try {

    // Map JavaScript types to Sequelize data types
    function getSequelizeType(value) {
      if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          return Sequelize.INTEGER;
        } else {
          return Sequelize.FLOAT;
        }
      } else if (typeof value === 'boolean') {
        return Sequelize.BOOLEAN;
      } else if (typeof value === 'string' && value.length > 255) {
        return Sequelize.TEXT;
      } else {
        return Sequelize.STRING;
      }
    }
    const entity = await Entity.findOne({ where: { name: entityName } });

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const tableName = entityName.toLowerCase() + "s";

    const defineModel = (tableName, attributes) => {
      return sequelize.define(tableName, attributes, {
        tableName: tableName,
        timestamps: false,
        freezeTableName: true,  // Use the exact table name without pluralizing
      });
    };

    const attributes = {};
    // Construct attributes dynamically based on the data
    Object.keys(data).forEach(key => {
      attributes[key] = getSequelizeType(data[key]);
    });

    const DynamicModel = defineModel(tableName, attributes);

    async function insertData(data) {
      try {
        await DynamicModel.create(data);
        console.log('Data inserted successfully.');
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    }

    // Call the function with the provided data
    data["EntityId"] = entity._previousDataValues.id;
    insertData(data);

    res.json({ message: 'Data created successfully!' });
  } catch (error) {
    console.error('Error creating data:', error.message);
    res.status(500).json({ error: 'Failed to create data' });
  }
});


// Update values for an entity
app.put("/api/updateValue/:entityName", async (req, res) => {
  try {
    const { entityName } = req.params;
    const { attributeName, updatedValue, index } = req.body;

    const tableName = entityName.toLowerCase() + "s";

    const values = [entityName, attributeName, updatedValue, index];
    console.log(values);

    const query = `UPDATE ${tableName} SET ${attributeName} = "${updatedValue}" WHERE id = ${index};`;
    await sequelize.query(query);

    await sequelize.query(query);

    res.status(200).send("Value updated successfully");
  } catch (error) {
    console.error("Error updating value:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Delete values for an entity
app.put("/api/deleteValue/:entityName", async (req, res) => {
  try {
    const { entityName } = req.params;
    const { index } = req.body;

    const entity = await Entity.findOne({ where: { name: entityName } });
    const entityId = entity.id;
    console.log("entity =", entity);

    const tableName = entityName.toLowerCase() + "s";
    console.log("tableName =", tableName);

    const [result] = await sequelize.query(`SELECT COUNT(*) AS row_count FROM ${tableName}`);
    const rowCount = result[0].row_count;

    if(rowCount === 1) {
      const query1 = `DELETE FROM entities WHERE id = ${entityId};`;
      const query2 = `DELETE FROM attributes WHERE entityId = ${entityId};`

      await sequelize.query(query1);
      await sequelize.query(query2);
    }

    const query = `DELETE FROM ${tableName} WHERE id = ${index};`;
    await sequelize.query(query);

    res.status(200).send("Value deleted successfully");
  }
  catch(error) {
    console.log("Error deleting entry:", error.message);
    res.status(500).send("Internal server error");
  }

});

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**displayentities
 * EntityForm
 * DataForm
 * Header
 * RenderTable
 * 
 */