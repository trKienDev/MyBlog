function replaceSpacesWithUnderscore(istring: string): string {
      return istring.replace(/\s+/g, '_');
}

const string_utils = {
      replaceSpacesWithUnderscore,
}
export default string_utils;