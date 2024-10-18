import * as XLSX from "xlsx";

const ResultsTable = ({ result }) => {
  // Función para calcular la diferencia de días entre dos fechas
  const calculateDaysDifference = (date1, date2) => {
    const formatDate = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };

    const formattedDate1 = new Date(formatDate(date1));
    const formattedDate2 = new Date(formatDate(date2));

    const diffTime = formattedDate1.getTime() - formattedDate2.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir de milisegundos a días
  };

  const calculateMonthsDifference = (date1, date2) => {
    const daysDifference = calculateDaysDifference(date1, date2);
    const monthsDifference = daysDifference / 30;
    return monthsDifference.toFixed(1); // Redondear a 1 decimal
  };

  // Ordenar los resultados de mayor a menor cantidad de meses
  const sortedResults = [...result].sort((a, b) => {
    const monthsA = calculateMonthsDifference(a.actualizado, a.ultimoMovimiento);
    const monthsB = calculateMonthsDifference(b.actualizado, b.ultimoMovimiento);
    return monthsB - monthsA; // Orden descendente
  });

  const exportToExcel = () => {
    if (result.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      sortedResults.map((item, index) => ({
        N: index + 1,
        Expediente: item.expediente,
        Jurisdiccion: item.jurisdiccion,
        Dependencia: item.dependencia,
        "Situación Actual": item.situacionActual,
        Caratula: item.caratula,
        "Datos de Origen": item.datosDeOrigen,
        "Último Movimiento": item.ultimoMovimiento,
        Actualizado: item.actualizado,
        "Diferencia (días)": calculateDaysDifference(item.actualizado, item.ultimoMovimiento),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expedientes");
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md text-xs">
            <thead className="bg-blue-600">
              <tr>
                <th className="py-1 px-1 border-b border-gray-700">N°</th>
                <th className="py-1 px-1 border-b border-gray-700">Expediente</th>
                <th className="py-1 px-1 border-b border-gray-700">Jurisdicción</th>
                <th className="py-1 px-1 border-b border-gray-700">Dependencia</th>
                <th className="py-1 px-1 border-b border-gray-700">Situación Actual</th>
                <th className="py-1 px-1 border-b border-gray-700">Carátula</th>
                <th className="py-1 px-1 border-b border-gray-700">Datos de Origen</th>
                <th className="py-1 px-1 border-b border-gray-700">Último Movimiento</th>
                <th className="py-1 px-1 border-b border-gray-700">Actualizado</th>
                <th className="py-1 px-1 border-b border-gray-700">Diferencia (días)</th>
                <th className="py-1 px-1 border-b border-gray-700">Cantidad de Meses</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700">
              {result.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-600 transition duration-200">
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{index + 1}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.expediente}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.jurisdiccion}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.dependencia}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.situacionActual}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.caratula}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.datosDeOrigen}</td>
                  <td className="py-1 px-1 border-b border-gray-600">{item.ultimoMovimiento}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">{item.actualizado}</td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">
                    {calculateDaysDifference(item.actualizado, item.ultimoMovimiento)}
                  </td>
                  <td className="py-1 px-1 border-b border-gray-600 text-center">
                    {calculateMonthsDifference(item.actualizado, item.ultimoMovimiento)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
