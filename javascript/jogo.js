function criarDinossauro() {
    return {
        POSICAO_PADRAO_X: 10,
        POSICAO_PADRAO_Y: 95,
        
        posicaoAtualX: 10,
        posicaoAtualY: 95,

        novoDinossauro: () => { return criarDinossauro() },

        CORIGIR_POSICAO_Y_QUANDO_AGACHADO:120,
        LARGURA_PADRAO: 20,
        larguraAtual: 20,

        ALTURA_PADRAO: 50,
        alturaAtual: 50,

        FORCA_PULO: 100,
        pulando: false,
        agachando: false,

        atualizarPosicao: function (gravidade) {
            if (this.pulando) {
                this.cair(gravidade);
            }
        },

        pular: function () {
            if (this.pulando || this.agachando) {
                return;
            }

            const novaPosicaoY = this.posicaoAtualY - this.FORCA_PULO;
            this.posicaoAtualY = novaPosicaoY;
            this.pulando = true;

        },

        cair: function (gravidade) {
            this.posicaoAtualY += gravidade;
            if (this.posicaoAtualY >= this.POSICAO_PADRAO_Y) {
                this.pulando = false;
                this.posicaoAtualY = this.POSICAO_PADRAO_Y;
            }


        },

        agachar: function () {
            if (this.pulando) {
                return;
            }
            const novaAltura = this.ALTURA_PADRAO / 2;
            this.alturaAtual = novaAltura;
            this.agachando = true;
            this.posicaoAtualY = this.CORIGIR_POSICAO_Y_QUANDO_AGACHADO;
            const novaLargura = novaAltura;
            this.larguraAtual = novaLargura;


        },

        levantar: function () {
            this.alturaAtual = this.ALTURA_PADRAO;
            this.posicaoAtualY = this.POSICAO_PADRAO_Y;
            this.agachando = false;
            this.larguraAtual = this.LARGURA_PADRAO;


        },

    }

}

function criarObstaculo({ posicaoX, posicaoY, largura, altura, cor } = 0) {
    return {

        posicaoX,
        posicaoY,
        novoObstaculo: (objeto) => { return criarObstaculo(objeto) },
        largura,
        altura,
        cor,

        atualizarPosicao: function (velocidade) {
            this.posicaoX = this.posicaoX - velocidade;
        },


    }
}

function criarJogador(dinossauro,maiorPlacarHtml,placarHtml) {
    return {
        placarMaisAlto: 0,
        dinossauro,
        pontos:0,
        maiorPlacarHtml,
        placarHtml,

        setarMaiorPlacar: function () {
            if (this.pontos > this.placarMaisAlto) {
                this.placarMaisAlto = this.pontos;
                this.maiorPlacarHtml.innerHTML = Math.round(this.placarMaisAlto);
                this.placarHtml.innerHTML = 0;
            }

        },

        setarPontos:function (pontosAReceber) {
            this.pontos += pontosAReceber;
        },

        zerarPontos: function() {
            this.pontos  = 0;
        },

        setarPlacar: function () {
            this.placarHtml.innerHTML = Math.round(this.pontos);
        }
    }
}


function criarTerreno(canvas) {
    return {
        largura: canvas.width,
        altura: 40,
        canvas,
        posicaoX: 0,
        posicaoY: 130,

    }

}


function criarJogo({ contexto, canvas, jogador, terreno, obstaculo, divReinicarJogo }) {
    return {
        PONTOS_PARA_RECEBER: 1,
        obstaculos: [],
        jogando: false,
        dinossauro: jogador.dinossauro,
        terreno,
        jogador,
        contexto,
        canvas,
        obstaculo,
        velocidadeJogo: 1,
        AUMENTO_VELOCIDADE:0.03,
        indiceDoQuadroDesenhado: 0,
        GRAVIDADE: 1.25,
        OBSTACULO_POSICOES_Y: [105, 80],
        OBSTACULO_CORES: ['green', 'red'],
        OBSTACULO_LARGURAS: [18, 14],
        OBSTACULO_ALTURAS: [40, 20],
        identificadorIntervaloObtaculo: 0,
        identificadorIntervaloPontos: 0,
        indetificadorIntervaloVelocidade: 0,
        divReinicarJogo,
        botaoReiniciar,
        pausado: false,


        setarValoresIniciais: function () {
            clearInterval(this.indetificadorIntervaloVelocidade);
            clearInterval(this.identificadorIntervaloPontos);
            clearInterval(this.identificadorIntervaloObtaculo);
            this.obstaculos = [];
            this.jogador.zerarPontos();
            this.velocidadeJogo = 1;
            this.dinossauro = this.dinossauro.novoDinossauro();
        },

        iniciarJogo: function () {
            this.setarValoresIniciais();
            this.jogando = true;
            this.pausado = false;
            this.leitorDeTeclado();
            this.desenharJogo();
            this.gerarObstaculos(this.obstaculos);
            this.aumentarVelocidade();
            this.aumentarPontos();

        },


        leitorDeTeclado: function () {
            window.addEventListener('keyup', (event) => {
                if (event.key == "ArrowDown" && this.jogando ) {
                    this.dinossauro.levantar();
                }
            })

            window.addEventListener('keydown', (event) => {
                if (event.key == " " && this.jogando ) {
                    this.dinossauro.pular();
                } else if (event.key == "ArrowDown" && this.jogando ) {
                    this.dinossauro.agachar();
                }

            })
        },

        aumentarPontos: function () {
            this.indetificadorIntervaloPontos = setInterval(() => {
                if (this.jogando && !this.pausado) {
                    this.jogador.setarPontos(this.PONTOS_PARA_RECEBER);
                    this.jogador.setarPlacar();
                }
            }, 1650);

        },

        aumentarVelocidade: function () {
            this.indetificadorIntervaloVelocidade = setInterval(() => {
                if (this.jogando && !this.pausado) {
                    this.velocidadeJogo += this.AUMENTO_VELOCIDADE;
                }
            }, 800);
        },

        gerarObstaculos: function (obstaculos) {
            this.indetificadorIntervaloObstaculo = setInterval(() => {
                if (this.jogando && !this.pausado) {
                    const tipoObstaculo = Math.round(Math.random() * (2 - 1) + 1);

                    const posicaoY = this.OBSTACULO_POSICOES_Y[tipoObstaculo - 1];
                    const cor = this.OBSTACULO_CORES[tipoObstaculo - 1];
                    const altura = this.OBSTACULO_ALTURAS[tipoObstaculo - 1]
                    const posicaoX = canvas.width + 20;

                    const tipoDaLargura = Math.round(Math.random() * (2 - 1) + 1);


                    const largura = this.OBSTACULO_LARGURAS[tipoDaLargura - 1];

                    const objetoObstaculo = {
                        posicaoX,
                        posicaoY,
                        largura,
                        altura,
                        cor
                    }


                    obstaculos.push(
                        this.obstaculo.novoObstaculo(objetoObstaculo)
                    );
                }
            }, 1650);
        },



        desenharJogo: function () {
            this.limparTela();

            if (this.jogando) {
                this.indiceDoQuadroDesenhado = requestAnimationFrame(() => {
                    this.desenharJogo();
                });
            }


            this.desenharTerreno();



            this.desenharJogador();


            this.obstaculos.forEach((obstaculo) => {
                this.desenharObstaculo(obstaculo, this.velocidadeJogo);
                this.detectarColisao(obstaculo, this.indiceDoQuadroDesenhado);
            });

            console.log(this.velocidadeJogo);

        },


        detectarColisao: function (obstaculo, indiceDoQuadroDesenhado) {
            const testeColisaoPorPosicaoLarguraObstaculo = this.dinossauro.posicaoAtualX < obstaculo.posicaoX + obstaculo.largura;
            const testeColisaoPorPosicaoLarguraDino = this.dinossauro.posicaoAtualX + this.dinossauro.larguraAtual > obstaculo.posicaoX;
            const testeColisaoPorPosicaoAlturaObstaculo = this.dinossauro.posicaoAtualY < obstaculo.posicaoY + obstaculo.altura;
            const testeColisaoPorPosicaoAlturaDino = this.dinossauro.posicaoAtualY + this.dinossauro.alturaAtual > obstaculo.posicaoY;


            if (testeColisaoPorPosicaoAlturaDino && testeColisaoPorPosicaoAlturaObstaculo) {
                if (testeColisaoPorPosicaoLarguraDino && testeColisaoPorPosicaoLarguraObstaculo) {
                    cancelAnimationFrame(indiceDoQuadroDesenhado);
                    this.jogando = false;
                    this.reiniciarJogo();


                }

            }

        },

        reiniciarJogo: function () {
            this.jogador.setarMaiorPlacar();
            this.divReinicarJogo.style.display = 'flex';
            this.pausado = true;
            this.botaoReiniciar.addEventListener('click', () => {
                if (!this.jogando) {

                    this.divReinicarJogo.style.display = 'none';
                    this.iniciarJogo();
                }

            });
        },



        limparTela: function () {
            this.contexto.fillStyle = 'rgba(0,0,0)';
            this.contexto.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },

        desenharTerreno: function () {
            this.contexto.fillStyle = 'rgba(48, 50, 2, 0.8)';
            this.contexto.fillRect(this.terreno.posicaoX, this.terreno.posicaoY, this.terreno.largura, this.terreno.altura);
        },

        desenharJogador: function () {
            this.dinossauro.atualizarPosicao(this.GRAVIDADE);
            this.contexto.fillStyle = 'blue';
            this.contexto.fillRect(this.dinossauro.posicaoAtualX, this.dinossauro.posicaoAtualY, this.dinossauro.larguraAtual, this.dinossauro.alturaAtual);

        },

        desenharObstaculo: function (obstaculo, velocidade) {
            obstaculo.atualizarPosicao(velocidade);
            this.contexto.fillStyle = obstaculo.cor;
            this.contexto.fillRect(obstaculo.posicaoX, obstaculo.posicaoY, obstaculo.largura, obstaculo.altura);

        },


    }
}


const divReinicarJogo = document.getElementById('div-reiniciar');
const divInicioJogo = document.getElementById('div-iniciar');

divReinicarJogo.style.display = 'none';

const botaoReiniciar = document.getElementById('botao-reiniciar');

const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');

const placarHtml = document.getElementById('placar-span');
const maiorPlacarHtml = document.getElementById('maior-placar');


const dinossauro = criarDinossauro();
const obstaculo = criarObstaculo();

const jogador = criarJogador(dinossauro,maiorPlacarHtml,placarHtml);
const terreno = criarTerreno(canvas);


const objetoJogo = {
    contexto,
    canvas,
    jogador,
    terreno,
    obstaculo,
    divReinicarJogo,
    botaoReiniciar
};

const jogo = criarJogo(objetoJogo);


window.addEventListener('keypress', () => {
    divInicioJogo.style.display = 'none';
    if (jogo.jogando || jogo.pausado) {
        return;
    }
    jogo.iniciarJogo();
})


