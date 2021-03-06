/*
    Arquivo principal que engloba os eventos e funções do desafio.
    Autor: Thiago Armede
    
    -Preenche dinamicamente as temperaturas com uso da API Apixu.
    -Muda os dias mostrados se baseando no dia atual.
    -Muda as imagens de fundo baseando-se no horario atual para dia ou noite.
*/


//função que atualiza o elemento a cada vez que a cidade muda.
refresh = (cidade) => {
    let dados;
    let request = new XMLHttpRequest();
    let dados_cidade;
    
    //requisitando os dados da API recebendo a cidade da interface.
    request.open('POST', `https://api.apixu.com/v1/forecast.json?key=4d38e52a8a2d445f943231135180902&q=${cidade.trim()}&days=4`, true);

    request.onload = function(){
        if(request.status >= 200 && request.status < 400){
            dados = JSON.parse(request.responseText);
            dados_cidade = {
                nome: cidade,
                temp1: dados.current.temp_c,
                temp2: dados.forecast.forecastday[1].day.avgtemp_c,
                temp3: dados.forecast.forecastday[2].day.avgtemp_c,
                temp4: dados.forecast.forecastday[3].day.avgtemp_c,
                condicao: dados.current.condition.text,
                icone: dados.current.condition.icon
            };
            //Chama função principal que muda o template baseado na resposta da API.
            update_template(dados_cidade);
        }else{
            alert('Impossivel recuperar dados da API.');
        }
    }

    request.send(); 
};

//função responsável por atualizar os elementos do DOM.
update_template = (dados_cidade) => {
    //Atribuindo elementos do DOM a serem atualizados.
    var botaoCidade = document.getElementById('btn-cidade');
    var elementoNomeCidade = document.getElementById('cidade');
    var divTemperaturaAtual = document.getElementById('temp1');
    var divTemperatura2 = document.getElementById('temp2');
    var divTemperatura3 = document.getElementById('temp3');
    var divTemperatura4 = document.getElementById('temp4');

    //Atualizando Botão
    botaoCidade.innerHTML = dados_cidade.nome;
    //Atualizando nome da cidade no widget
    elementoNomeCidade.innerHTML = dados_cidade.nome;
    //Atualizando temperaturas com template strings.
    divTemperaturaAtual.innerHTML = `${dados_cidade.temp1}&deg;<small>C</small>`;
    divTemperatura2.innerHTML = `${dados_cidade.temp2}&deg;<small>C</small>`;
    divTemperatura3.innerHTML = `${dados_cidade.temp3}&deg;<small>C</small>`;
    divTemperatura4.innerHTML = `${dados_cidade.temp4}&deg;<small>C</small>`;

    //mudança do icone da temperatura de acordo com os dados recebidos.
    var iconeTemperatura = document.getElementById('icone-temp');
    iconeTemperatura.setAttribute('src', `http:${dados_cidade.icone}`);

    //mudando imagem do fundo do widget
    Data = new Date();
    var displayImagemFundo = document.querySelector('.weather .current');   
    var hora = Data.getHours();
    fotos_temperatura(displayImagemFundo, hora, dados_cidade);

    //Recebendo dias posteriores para preencher UI.
    diasPosteriores = retornaDias(Data.getDay());
    //Buscando elementos que mudarão os dias
    elementosArray = Array.from(document.querySelectorAll('.day-ui'));
    //preenchendo conteúdo desses elementos com os dias corretos.
    elementosArray[0].firstChild.textContent = diasPosteriores[0];
    elementosArray[1].firstChild.textContent = diasPosteriores[1];
    elementosArray[2].firstChild.textContent = diasPosteriores[2];
};  

/*
                Funções Auxiliares
    (uso delas nas funções principais acima.)
*/

//Troca a imagem de fundo do widget baseando-se na hora local.
fotos_temperatura = (display, hora, dados_cidade) => {
    if (hora >= 19 || hora <= 4) {
        if (dados_cidade.nome == "Rio de Janeiro") {
            display.style.background = "url('./images/rj-noite.jpg') repeat-x";
        } else if (dados_cidade.nome == "Salvador") {
            display.style.background = "url('./images/salvador-noite.jpg') repeat-x";
        } else if (dados_cidade.nome == "São Paulo") {
            display.style.background = "url('./images/sp-noite.jpg') repeat-x";
        }
    } else {
        if (dados_cidade.nome == "Rio de Janeiro") {
            display.style.background = "url('./images/rj-dia.jpg') repeat-x";
        } else if (dados_cidade.nome == "Salvador") {
            display.style.background = "url('./images/salvador-dia.JPG') repeat-x";
        } else if (dados_cidade.nome == "São Paulo") {
            display.style.background = "url('./images/sp-dia.jpg') repeat-x";
        }
    }
}

//Calcula os dias posteriores baseando-se no dia atual.
retornaDias = (dia) => {
    let diasSiglas = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    let diasRetorno = [];

    diasRetorno.push(diasSiglas[(dia + 1) % 7]);
    diasRetorno.push(diasSiglas[(dia + 2) % 7]);
    diasRetorno.push(diasSiglas[(dia + 3) % 7]);

    return diasRetorno;
};
