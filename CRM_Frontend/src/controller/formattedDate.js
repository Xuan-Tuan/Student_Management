function formattedDate(date) {
  if (!date) {
    return null;
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function convertDateFormat(dateString) {
  if (!dateString) {
    return null;
  }
  const dateParts = dateString.split("/");
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

export { formattedDate, convertDateFormat };
