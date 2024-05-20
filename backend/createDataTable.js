

// create a table definition for the entity's data

// extract values of a particular column in attributes
const attributeNames = [];
attributes.map((attr) => {
    attributeNames.push(attr.name);
});

const modelAttributes = {};
    attributeNames.forEach((attributeName) => {
    modelAttributes[attributeName] = {
        type: Sequelize.STRING,
        allowNull: false // You can customize this part based on your requirements
    };
});

const DataForEntity = sequelize.define(`${name}`,
    modelAttributes, {
    timestamps: false
});

Entity.hasMany(DataForEntity);

sequelize.sync({ alter: true })
.then(() => {
    console.log("DataOfEntity table created");
})
.catch((error) => console.error("error creating DataOfEntity table"));

/* Find this table in database */
const tableRef = "";