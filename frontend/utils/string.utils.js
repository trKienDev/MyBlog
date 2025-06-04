function replaceSpacesWithUnderscore(string) {
      return string.replace(/\s+/g, '_');
}
function removeSpaces(string) {
      return string.replace(/\s/g, ''); 
}
const string_utils = {
      removeSpaces,
      replaceSpacesWithUnderscore,
}
export default string_utils;