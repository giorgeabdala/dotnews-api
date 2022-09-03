import removeMarkdown from "markdown-to-text";


export class WordProcessor{
    private static readonly _instance: WordProcessor = new WordProcessor();



    public  transformText(text) {
        text = this.removeTrash(text);
        return this.spelling(text);
    }

    //trata o texto para retirar markdown, links, tags e outros
    public removeTrash(text) {
        const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm;
        text = text.replace(regex, ' ');
        text = removeMarkdown(text);
        const regexN = /\n/gms;
        return text.replace(regexN, '.');

    }

    public spelling(text) {
        const regex = /de [Pp]olkadot/gm;
        text = text.replace(regex, "da Polkadot");
        return text;
   }


    public  transformTitle(title) {
        const regex = /Polkadot digest/gmsi;
        title = (title ? title.replace(regex, "Polkadot") : `Polkadot  ${new Date().toLocaleDateString()}`);
        return title;
    }


}