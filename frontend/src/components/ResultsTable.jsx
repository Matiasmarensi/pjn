import * as XLSX from "xlsx";

const ResultsTable = ({ result }) => {
  const exportToExcel = () => {
    if (result.length === 0) return;

    // Crear una nueva hoja con los datos de la tabla
    const worksheet = XLSX.utils.json_to_sheet(
      result.map((item, index) => ({
        N: index + 1,
        Expediente: item.expediente,
        Jurisdiccion: item.jurisdiccion,
        Dependencia: item.dependencia,
        "Situación Actual": item.situacionActual,
        Caratula: item.caratula,
        "Datos de Origen": item.datosDeOrigen,
        "Último Movimiento": item.ultimoMovimiento,
        Actualizado: item.actualizado,
      }))
    );

    // Crear un nuevo libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expedientes");

    // Exportar a archivo Excel
    XLSX.writeFile(workbook, "expedientes.xlsx");
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <button
        onClick={exportToExcel}
        className="mb-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-200"
      >
        Exportar a Excel
      </button>
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
              <th className="py-2 px-4 border-b border-gray-700">Último Movimiento</th>
              <th className="py-2 px-4 border-b border-gray-700">Actualizado</th>
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
                <td className="py-2 px-4 border-b border-gray-600">{item.ultimoMovimiento}</td>
                <td className="py-2 px-4 border-b border-gray-600">{item.actualizado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsTable;
