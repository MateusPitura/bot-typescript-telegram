const unwantedTexts = [
  [
    "🎉 #publi · esses são links de afiliado | você não paga nenhum adicional e ainda ajuda o canal.",
    " ",
  ],
  ["⚠️ Oferta por tempo limitado!", " "],
  ["📣 Anúncio\n\n🛒 FELPS RECOMENDA\nhttps://felpsrecomenda.com.br", " "],
  ["Compre aqui: ", " "],
  ["–", "-"],
  ["⚫️", " "],
  ["🛒", " "],
  ["✅", " "],
  ["🔗", " "],
  ["🔥", " "],
  ["💳", " "],
  ["➡️", " "],
  ["\n", " "],
];

export function formatMessage(originalMessage: string): string {
  let formattedMessage = originalMessage;
  for (const unwantedText of unwantedTexts) {
    formattedMessage = formattedMessage.replace(
      unwantedText[0],
      unwantedText[1],
    );
  }
  return formattedMessage;
}
