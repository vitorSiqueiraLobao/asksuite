const BrowserService = require("../services/BrowserService")
class searchController {
    static async getData(request, response) {
        //inicia o servico do navegador e abre uma nova pagina
        const browser = await BrowserService.getBrowser()
        const page = await browser.newPage();

        //tratamento dos dados passados na requisicao
        const checkin = request.body.checkin.split("-")[2]+request.body.checkin.split("-")[1]+request.body.checkin.split("-")[0]
        const checkout = request.body.checkout.split("-")[2]+request.body.checkout.split("-")[1]+request.body.checkout.split("-")[0]

        //carregamento da pagina desejada no servico do navegador
        await page.goto(process.env.URL.replace('${checkin}', checkin).replace('${checkout}', checkout),{'waitUntil' : 'domcontentloaded'});
        
        //codigo executado dentro do navegador para capturar os dados
        const data = await page.evaluate(async () => {
            //secao que contem todos os quartos
            const rooms = document.querySelectorAll("#hotels_grid > div");
            const resp = [];

            //percursao de todas divs
            rooms.forEach((room,index)=>{
                //tratamento das divs (quartos sao somente os com o className = 'roomrate box-sh border-unset ')
                if(room.className === 'roomrate box-sh border-unset '){
                    //carregamento dos dados do quarto no array a ser retornado
                    resp.push({
                        name: document.querySelector(`#hotels_grid > div:nth-child(${index+1}) > div.flex-view-step2 > div.desciption.position-relative > span > p`).textContent.replaceAll("\n",""),
                        description: document.querySelector(`#hotels_grid > div:nth-child(${index+1}) > div.flex-view-step2 > div.desciption.position-relative > p.description.hotel-description`).textContent.replaceAll("\n",""),
                        price: document.querySelector(`#hotels_grid > div:nth-child(${index+1}) >  div:nth-child(4) > div.right-part-of-rate > div > div.price-step2.t-tip__next > p.price-total.price-closed-arival`).textContent.replaceAll("\n",""),
                        image: document.querySelector(`#hotels_grid > div:nth-child(${index+1 }) > div.flex-view-step2 > div.t-tip__next > div > img.image-step2`).src
                    })
                }
            })
            return resp
           
        })
        //servico do navegador encerrado
        await BrowserService.closeBrowser(browser)
        //envio da resposta para o usuario
        response.status(200).send(data)

    }
}

module.exports = searchController