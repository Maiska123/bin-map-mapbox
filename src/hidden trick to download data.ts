hidden trick to download data

//Initialization of object to save
var objectToSave={first:'string', second: function(){}};
//Start of saving method
var textToSave='';//String to be saved
var count=0;
for(var i in objectToSave){
//Adding every key name + type + text value to string
textToSave+=objectToSave[i].constructor.name+' '+ Object.keys(objectToSave)[count]+' = '+objectToSave[i]+'\n';
count++;
}
//Saving string to file using html clicking trick
var hiddenElement = document.createElement('a');
hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
hiddenElement.target = '_blank';
hiddenElement.download = 'myFile.txt';
hiddenElement.click();




--------------------
Result of this method is saved txt file with text:

String first = string

Function second = function (){}
