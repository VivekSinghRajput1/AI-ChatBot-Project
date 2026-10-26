
// for checking if the array element is heading or not {returns true or false}
// if at start of array element {**} present returns true

export function checkHeading(str){
    return /^(\*)(\*)|(.*)\*$/.test(str);
 }


export function replaceHeadingStarts(str){
    return str.replace(/^(\*)(\*)|(\*)$/g,'');
 }