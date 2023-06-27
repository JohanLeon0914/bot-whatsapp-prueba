const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

// const generateText = async (body) => {
//   try {
//     let text =
//       'Actúa como un empleado de una floristeria llamada "flores y más", finge que te habla un cliente que te hara preguntas sobre la floristeria, esta tiene varias opciones de flores como rosas, tulipanes y demas, son expertos en hacer ramos para diferentes eventos como bodas, reuniones, funerales, etc.Tu respuesta no debe ser superior a 300 caracteres. Usa un nivel de temperatura=5.La pregunta del cliente es:' +
//       body;
//     const completion = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: text,
//       max_tokens: 300,
//     });
//     return completion.data.choices[0].text;
//   } catch (error) {
//     // Consider adjusting the error handling logic for your use case
//     if (error.response) {
//       console.error(error.response.status, error.response.data);
//       return error.response.status;
//     } else {
//       console.error(`Error with OpenAI API request: ${error.message}`);
//     }
//   }
// };

// const flowOfertas = addKeyword("ofertas").addAnswer([
//   "Tenemos para ti las siguientes ofertas:",
//   {
//     media:
//       "https://www.interflora.es/blog/wp-content/uploads/Ofertas-de-flores-a-domicilio.png",
//   },
//   "50% de descuento en todos nuestros ramos de bodas.",
// ]);

// const flowDiscord = addKeyword(["discord"]).addAnswer(
//   [
//     "🤪 Únete al discord",
//     "https://link.codigoencasa.com/DISCORD",
//     "\n Unete si deseas tener mas información.",
//   ],
//   null,
//   null
// );

// const flowSecundario = addKeyword(["pregunta", "siguiente"])
//   .addAnswer(
//     "Dime, ¿que más necesitas saber?",
//     { capture: true },
//     async (ctx, { flowDynamic }) => {
//       const textChatgpt = await generateText(ctx.body);
//       flowDynamic([{ body: textChatgpt }]);
//     }
//   )
//   .addAnswer(
//     [
//       "Espero que esta información haya sido de ayuda",
//       "👉 *discord* unirte al discord",
//       "👉 *pregunta* si deseas volver a preguntarme algo",
//       "👉 *ofertas* para ver nuestros descuentos especiales"
//     ],
//     null,
//     null,
//     [flowDiscord, flowOfertas]
//   );
// const flowPopetas = addKeyword(["algodon"]).addAnswer(
//   [
//     "Aquí te envio las opciones de tamaños de algodones de azucar que puedes ordenar",
//     "👉 *pequeño* para señalar el tamaño pequeño de algodon de azucar",
//     "👉 *grande* para señalar el tamaño grande de algodon de azucarr"
//   ],
//   null,
//   null,
  
// );

// const flowAlgodon = addKeyword(["popetas"]).addAnswer(
//   [
//     "Aquí te envio las opciones que puedes elegir",
//     "👉 *saladas* para solicitar unas deliciosas palomitas saladas con mantequeilla y sal",
//     "👉 *caramelo* para solicitar un pedido a dulces palomitas acarameladas"
//   ],
//   null,
//   null,
  
// );

const flowDomicilio = addKeyword(["domicilio", "Domicilio", "Dommicilio", "dommicilio", "Domisilio", "domisilio", "Dommisilio", "dommisilio"]).addAnswer(
  [
    "¡Gracias por elegir el servicio a domicilio de Doña Popetas! 🌟 Estamos aquí para endulzar tu día y llevar deliciosas golosinas hasta la puerta de tu hogar. 😊",
    "En Doña Popetas contamos con una amplia variedad de opciones que te encantarán:",
    "🍿 ¿Prefieres palomitas saladas o acarameladas? ¡Ambas son una delicia para disfrutar en casa!",
    "☁ ¿Qué te parece un esponjoso algodón de azúcar? Será como una nube dulce en tu paladar.",
    "Por favor, déjanos tu pedido por escrito y enseguida un amable asesor humano se encargará de atenderte y tomar todos los detalles necesarios. ¡Estamos ansiosos por servirte!"
  ],
  {
    media: 'https://i.ibb.co/stBSFbW/imagen-2023-06-27-102923826.png'
  },
  null
);

const flowPrincipal = addKeyword(["hola", "ola"])
  .addAnswer(
    "🙌 Hola bienvenido a Doña Popeta, ¿desea realizar algún pedido a domicilio?"
  )
  // .addAnswer(
  //   "Necesitar saber algo?",
  //   { capture: true },
  //   async (ctx, { flowDynamic }) => {
  //     const textChatgpt = await generateText(ctx.body);
  //     flowDynamic([{ body: textChatgpt }]);
  //   }
  // )
  .addAnswer(
    [
      "👉 *domicilio* para solicitar un pedido a domicilio",
    ],
    null,
    null,
    [flowDomicilio]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
