// ResultsTable.jsx
const ResultsTable = ({ result }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {result.length > 0 && (
        <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">N°</th>
              <th className="py-2 px-4 border-b border-gray-700">Expediente</th>
              <th className="py-2 px-4 border-b border-gray-700">Jurisdicción</th>
              <th className="py-2 px-4 border-b border-gray-700">Dependencia</th>
              <th className="py-2 px-4 border-b border-gray-700">Situación Actual</th>
              <th className="py-2 px-4 border-b border-gray-700">Carátula</th>
              <th className="py-2 px-4 border-b border-gray-700">Datos de Origen</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700">
            {result.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-600 transition duration-200">
                <td className="py-2 px-4 border-b border-gray-600">{index + 1}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.expediente}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.jurisdiccion}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.dependencia}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.situacionActual}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.caratula}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.datosDeOrigen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsTable;
