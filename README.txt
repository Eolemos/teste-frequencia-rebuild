TESTE DE FREQUENCIA - REVISAO FINAL

ARQUIVO PRINCIPAL
index.html

CSS PRINCIPAL
O CSS que a pagina usa esta embutido no proprio index.html.
O arquivo css/style.css esta reservado e nao esta conectado no index.html.

JAVASCRIPT PRINCIPAL
O fluxo principal esta embutido no index.html.
O redirecionamento de checkout fica em:
js/checkout-override.js

COMO ABRIR LOCALMENTE
Abra o arquivo index.html no navegador.

COMO TROCAR O CHECKOUT
Edite:
js/checkout-override.js

Link configurado atualmente:
https://pay.cakto.com.br/33txxoj

Para trocar depois, altere a constante CHECKOUT_URL pelo novo link real do checkout.
O redirecionamento preserva estes parametros:
utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid.

ONDE COLOCAR A VSL
Coloque o video em:
assets/video/vsl.mp4

O passo de VSL no index.html ja aponta para esse arquivo local.
Se o arquivo nao existir, o espaco do player fica preservado, mas nao havera video para tocar.

LEGENDAS E AUDIO DO PASSO 11
Os audios narrados reais do site original ficam em:
captions/[genero]_[idade]_[civil].mp3

As legendas reais sincronizadas ficam em:
captions/[genero]_[idade]_[civil].vtt

Generos:
h = homem
m = mulher

Faixas de idade:
20, 30, 40, 50, 60

Estado civil:
s = solteiro/separado/viuvo
c = casado/namorando/noivo

Exemplos:
captions/h_40_s.mp3
captions/m_40_s.mp3
captions/h_50_c.mp3

O index.html escolhe automaticamente o arquivo pelo genero, ano de nascimento e estado civil respondidos no quiz. As 20 legendas tambem estao embutidas em CAPTION_SETS, para funcionar mesmo quando o navegador nao carregar o VTT nativo em arquivo local.

Depois do primeiro e-mail, o index.html troca automaticamente para a segunda parte do audio conforme o desafio escolhido:
Financas -> captions/p2_dinheiro.mp3 / captions/p2_dinheiro.vtt
Saude -> captions/p2_saude.mp3 / captions/p2_saude.vtt
Felicidade -> captions/p2_felicidade.mp3 / captions/p2_felicidade.vtt
Vida Amorosa + homem casado/namorando/noivo -> captions/p2_h_casado.mp3 / captions/p2_h_casado.vtt
Vida Amorosa + mulher casada/namorando/noiva -> captions/p2_m_casada.mp3 / captions/p2_m_casada.vtt
Vida Amorosa + homem solteiro/separado/viuvo -> captions/p2_h_solteiro.mp3 / captions/p2_h_solteiro.vtt
Vida Amorosa + mulher solteira/separada/viuva -> captions/p2_m_solteira.mp3 / captions/p2_m_solteira.vtt

O botao final da narracao redireciona para:
https://pay.cakto.com.br/33txxoj

VSL FINAL
O passo final ainda aponta para:
assets/video/vsl.mp4

O site original usa player externo nessa etapa e nao expunha uma legenda VTT ativa para copiar. O arquivo assets/video/vsl.vtt fica reservado para quando houver uma VSL local com legenda propria.

IMAGENS LOCAIS ENCONTRADAS
img/bg_divino.d0e06856.png
img/female.a214dfbb.png
img/masculine.b27a3766.png
img/stop.f3d2a697.png
assets/img/female.a214dfbb.png
assets/img/homem.png
assets/img/masculine.b27a3766.png
assets/img/mulher.png
assets/img/stop.f3d2a697.png
assets/imgs/*.png e assets/imgs/*.gif usados no trecho narrado do passo 11

IMAGENS/ASSETS DO PASSO 11
As imagens do trecho narrado foram baixadas para assets/imgs/ e o index.html aponta para os arquivos locais.

VIDEOS ENCONTRADOS
Nenhum video local foi encontrado.
Criar/colocar a VSL em assets/video/vsl.mp4.

FONTES ENCONTRADAS
Nenhuma fonte local foi encontrada em assets/fonts.
A pagina agora usa uma pilha segura:
Inter, Poppins, Montserrat, Arial, Helvetica, sans-serif.

ARQUIVOS QUE PODEM SER REMOVIDOS COM CUIDADO
css2 - arquivo baixado de Google Fonts, nao conectado no index.html.
_fonte_original.html - copia de referencia, nao e a pagina principal.
19056e9b-6376-4e08-aae3-81a5eb1fdbc5/players/.../player.js - player externo antigo, nao usado depois da troca para VSL local.

COMO SUBIR EM HOSPEDAGEM
Suba toda a pasta mantendo a estrutura de diretorios.
Garanta que index.html esteja na raiz.
Garanta que js/checkout-override.js, img/, captions/ e assets/ subam junto.
Coloque a VSL em assets/video/vsl.mp4 antes de publicar, se quiser que o video local toque.

CORRECOES FEITAS
Removida a dependencia de Google Fonts do index.html.
Aplicada pilha de fonte local segura no corpo, botoes, inputs e titulos.
Trocados fundos externos bg_divino para img/bg_divino.d0e06856.png.
Trocada a imagem de PARE para a imagem real img/stop.f3d2a697.png.
Baixado o audio real h_40_s.mp3 do trecho narrado.
Baixados os 20 audios reais do trecho narrado por genero, faixa de idade e estado civil.
Baixadas e conectadas as 20 legendas reais correspondentes.
Configurada escolha automatica do audio/legenda no passo 11 conforme respostas do quiz.
Configurada a segunda parte do audio/legenda conforme o desafio escolhido no quiz.
Corrigido o primeiro popup de e-mail para bater com a fala do audio.
Configurado checkout final em https://pay.cakto.com.br/33txxoj.
Corrigida sobra final da legenda p2_m_casada para terminar junto com o MP3 real.
Configurado elemento dinamico no titulo da leitura conforme numerologia da data de nascimento.
Baixadas as imagens reais do trecho narrado em assets/imgs/.
Refeito o layout da tela PARE/COMECAR e da tela narrada para o formato largo do original.
Trocado player externo da VSL por video local em assets/video/vsl.mp4.
Adicionadas protecoes de responsividade para 360px, 390px, 430px e desktop.
Adicionada protecao para imagem ausente no passo 11 nao exibir icone quebrado.
Revisado o checkout para preservar UTMs/fbclid e alertar se o link ainda estiver no placeholder.

COMANDOS
explorer "C:\Users\lemos\OneDrive\Documentos\Money\soucer\Sites\teste-frequencia-rebuild"
start "" "C:\Users\lemos\OneDrive\Documentos\Money\soucer\Sites\teste-frequencia-rebuild\index.html"
