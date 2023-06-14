const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['Pregunta', 'siguiente'])
    .addAnswer('Dime, ¿que más necesitas saber?', {capture: true},async (ctx, {flowDynamic}) => {
        const textChatgpt = await generateText(ctx.body)
        flowDynamic([{body: textChatgpt}])
    })
    .addAnswer(
        [
            'Espero que esta información haya sido de ayuda',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
            '👉 *pregunta* si deseas volver a preguntarme algo'
        ],
        null,
        null,
    )

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*pregunta* Si quieres volver a preguntarme algo.',
    ],
    null,
    null,
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*pregunta* Si quieres volver a preguntarme algo..',
    ],
    null,
    null,
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*pregunta* Si quieres volver a preguntarme algo.',
    ],
    null,
    null,
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
)

const generateText = async (body) => {
    try {
      let text = 'Actúa como un consultor experto en finanzas y criptomonedas bajo el seudónimo "CryptoBot".Tu respuesta no debe ser superior a 300 caracteres. Usa un nivel de temperatura=5.La pregunta es:' + body 
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: text,
          max_tokens: 300,
        });
        return completion.data.choices[0].text;
      } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          console.error(error.response.status, error.response.data);
          return error.response.status
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
        }
      }
};

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
    )
    .addAnswer('Necesitar saber algo?', {capture: true},async (ctx, {flowDynamic}) => {
        const textChatgpt = await generateText(ctx.body)
        flowDynamic([{body: textChatgpt}])
    })
    .addAnswer(
        [
            'Espero que esta información haya sido de ayuda',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
            '👉 *pregunta* si deseas volver a preguntarme algo'
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowSecundario])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
