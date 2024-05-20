export default function RenderData({ entityData }) {
    return (
        <div className="container mx-auto px-4 py-4">
            {entityData.map((dataObj, index) => (
                <div key={index} className="mb-2">
                    {Object.keys(dataObj).map((key, index) => (
                        <h2 key={index} className="text-xl font-semibold">{dataObj[key]}</h2>
                    ))}
                </div>
            ))}
        </div>
    );
}
