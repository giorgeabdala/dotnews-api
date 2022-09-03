import {SubService} from "../src/subService";
import config from "../src/config/Config";
import {WordProcessor} from "../src/wordProcessor";



describe('Testes do tratamento do texto recebido pelo subsocial', () => {
    it('Deve retornar o texto sem linguagem markdown, links e outros carategeres não naturais', () => {
        const wordprocessor = new WordProcessor();
        const text = "## Notícias de Polkadot\n\nPolkadot 0.9.26 foi lançada com prioridade de atualização MÉDIA. [https://github.com/paritytech/polkadot/releases/tag/v0.9.26](https://github.com/paritytech/polkadot/releases/tag/v0.9.26)\n\nUm relatório recente do Messari afirma que Polkadot tem a segunda maior comunidade de desenvolvedores de ecossistemas blockchain em 2021. [https://twitter.com/MessariCrypto/status/1548306503471312897](https://twitter.com/MessariCrypto/status/1548306503471312897)\n\nManta Network apresentou uma proposta ao Tesouro para desenvolver o OpenZL, uma biblioteca de código aberto para ajudar desenvolvedores a escrever e implantar código *zero-knowledge proof*em produção. [https://polkadot.subsquare.io/council/motion/231](https://polkadot.subsquare.io/council/motion/231)\n\n## Notícias de Kusama\n\nKintsugi ganhou o mais recente leilão de aluguel de parachain. Isso renova seu slot atual.\n\nCom um dia e meio até o início do Período Final, a GM Parachain está na liderança do atual leilão de arrendamento de parachain";
        const textTratado = wordprocessor.removeTrash(text);
        const esperado = "Notícias de Polkadot..Polkadot 0.9.26 foi lançada com prioridade de atualização MÉDIA...Um relatório recente do Messari afirma que Polkadot tem a segunda maior comunidade de desenvolvedores de ecossistemas blockchain em 2021...Manta Network apresentou uma proposta ao Tesouro para desenvolver o OpenZL, uma biblioteca de código aberto para ajudar desenvolvedores a escrever e implantar código zero-knowledge proofem produção...Notícias de Kusama..Kintsugi ganhou o mais recente leilão de aluguel de parachain. Isso renova seu slot atual...Com um dia e meio até o início do Período Final, a GM Parachain está na liderança do atual leilão de arrendamento de parachain";

        expect(textTratado).toBe(esperado);

    });

    it('Deve retornar o titulo no formato Polkadot - data', () => {
            const wordprocessor = new WordProcessor();
            const title = 'Polkadot digest - 08 de agosto de 2022';
            const titleTratado = wordprocessor.transformTitle(title);
            expect(titleTratado).toBe('Polkadot - 08 de agosto de 2022');
        }
    );

    it('Deve retornar maitext corrigido com a preposição da palavra Polkadot', () => {
            const wordprocessor = new WordProcessor();
            const text = 'Notícias de Polkadot..O Referendo 71, que propõe a elevação do tempo de execução de Polkadot';
            const esperado = 'Notícias da Polkadot..O Referendo 71, que propõe a elevação do tempo de execução da Polkadot';

            const textTratado = wordprocessor.spelling(text);

            expect(textTratado).toBe(esperado);
        }
    );

    it('Deve retornar o texto tratado', () => {
            const wordprocessor = new WordProcessor();
            const text = "## Notícias de Polkadot\n\nPolkadot 0.9.26 foi lançada com prioridade de Polkadot. [https://github.com/paritytech/polkadot/releases/tag/v0.9.26](https://github.com/paritytech/polkadot/releases/tag/v0.9.26)\n\nUm";
            const esperado = "Notícias da Polkadot..Polkadot 0.9.26 foi lançada com prioridade da Polkadot...Um";
            const textTratado = wordprocessor.transformText(text);
            expect(textTratado).toBe(esperado);
        }
    );

} );

describe('Testa as chamadas ao Subsocial', () => {

        it('Deve retornar a id do primeiro post do Polkadot Digest BR', async () => {
                let apiSub = await SubService.getInstanceSubService();
                const posts = await apiSub.getAllFeeds(config.spaceIdDigestBr);
                const firstPost = posts[0];
                expect(firstPost.uid).toBe("34616");


            }
        );

    }

    );
