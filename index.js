require('dotenv').config();
const axios = require("axios")

const { program } = require('commander');

program

.option("-d, --debug", "output extra debugging")
.option("-T, --target <type>", "Target language to translate")
.option("-F, --from <type>", "Translate from the given language")


//input argument get parsed
program.parse(process.argv);

const apikey = process.env.TRANSLATE_KEY;

const errorHandler = (message) =>{
    console.error(message);
    process.exit(1);
} 

if(!apikey){
    errorHandler("No apiKey found");
}

if(program.debug){
    console.log("running in debug mode");
    console.log(program.opts());
    console.log("The text to be translated - ");
    console.log(program.args[0]);
}

const textToTranslate = program.args[0];
const targetLanguage = program.target;
const fromLanguage = program.from;

if(targetLanguage || fromLanguage){
    axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key= ${apikey} &text=${textToTranslate} &lang=${fromLanguage? `${fromLanguage}-`: "" }${targetLanguage}`
    ).then(res => {
        if(program.debug){
            console.log("response from yandex -");
            console.log(res.data);
        }
        const {data} = res
        if (data.code === 200){
            console.log(data.text[0])
        }else{
            errorHandler(res)
        }
    })
     .catch(errorHandler);  
}
else{
    axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key= ${apikey} &text=${textToTranslate} &lang=en`
).then(res => {
    if(program.debug){
        console.log("response from yandex -");
        console.log(res.data);
    }
    const {data} = res;
    if (data.code === 200){
        console.log(data.text[0])
    }else{
        errorHandler(res)
    }
})
 .catch(errorHandler);
}