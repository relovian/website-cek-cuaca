const searchButton = document.querySelector('.searchCity');
const input = document.querySelector('.inputCity');

    document.addEventListener("DOMContentLoaded", async function() {  
        
        fristLoad()
    
         async function fristLoad(location = 'surabaya'){
            const icon = document.querySelector('.iconCuaca');
            let detailsTemp = document.querySelector('.detailsTemp');
            let detailsLembap = document.querySelector('.detailsLembap');
            let detailsPres = document.querySelector('.detailsPres');
            let detailsKet = document.querySelector('.detailsKet');
            
            let city = location;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7e405cecf442a0c64962afd218fef68c&units=metric`)
            const cuaca = await response.json();
            const unixTimestamp = cuaca.dt;
            const dataObjek = new Date(unixTimestamp * 1000);
            const time = dataObjek.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
            const date = dataObjek.toLocaleDateString('id-ID', {weekday: 'short', month: 'short', day: 'numeric'});
            // const list =  await cuaca.list;
    
            icon.src = `https://openweathermap.org/img/wn/${cuaca.weather[0].icon}@4x.png`;
            detailsTemp.innerHTML = `TEMP: ${cuaca.main.temp} &deg C`;
            detailsLembap.innerHTML = `KELEMBAPAN: ${cuaca.main.humidity} %`;
            detailsPres.innerHTML = `ANGIN: ${cuaca.wind.speed} m/s`;
            detailsKet.innerHTML = `KETERANGAN: ${cuaca.weather[0].description}`;
            fetchCurrentWeather(city);
            fetchHourlyForecast(city);
        }

        searchButton.addEventListener('click', async function() {
            const locationCity = input.value;

            fetchCurrentWeather(await locationCity);
            fetchHourlyForecast(await locationCity);
            fristLoad(locationCity);
        });
    });


async function fetchCurrentWeather(city = 'surabaya'){

    if(city){
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7e405cecf442a0c64962afd218fef68c&units=metric`)
        const cuaca =  await response.json();

        updateUICurrent(cuaca);
    } 
   
}


async function fetchHourlyForecast(city = 'surabaya'){

    if(city){
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7e405cecf442a0c64962afd218fef68c&units=metric`)
        const cuaca =  await response.json();
        const list = cuaca.list;

        updateUIHourly(list);  
    }
    
}


function updateUIHourly(data){
    const containerCard = document.querySelector('.scrollContainer'); 
    containerCard.innerHTML = '';

    
    data.forEach(itemDate => {
        const box = document.createElement('div');
        box.className = 'cards';
        containerCard.appendChild(box);
        box.innerHTML = cards(itemDate);
        
        let wrapper = '';
        wrapper += showDetails(itemDate);
        details(box, itemDate, wrapper);
    }) 

}

function details(box, itemDate, wrapper){

    box.addEventListener('click', function() {
        const showDetails = document.querySelector('.cuaca');
        const clickedCard = event.target.closest('.cards');

         if(clickedCard){
            const scrollContainer = document.querySelector('.scrollContainer');
            const currentActiveCard = scrollContainer.querySelector('.active-card');

            if(currentActiveCard && currentActiveCard !== clickedCard){
                currentActiveCard.classList.remove('active-card');
            }
            clickedCard.classList.add('active-card');
         }

        showDetails.innerHTML = wrapper;

    });


}

function updateUICurrent(data){
    if(data.name == undefined) {
        alert('kota yang kamu cari tidak ada....');
    } else {
        const name = document.querySelector('.name');
        name.textContent = `Cuaca Di ${data.name} Terkini `;
    }
}


function showDetails(data){

    return `<div class="boxIcon">
                <img class="iconCuaca" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="">
            </div>
            <div class="boxInformation">
                <p class="details detailsTemp">TEMP: ${data.main.temp} &deg C</p>
                <p class="details detailsLembap">KELEMBAPAN: ${data.main.humidity} % </p>
                <p class="details detailsPres">ANGIN: ${data.wind.speed} m/s </p>
                <p class="details detailsKet">KETERANGAN: ${data.weather[0].description}</p>
            </div>`;
}


function cards(data){
    
    const unixTimestamp = data.dt;
    const dataObjek = new Date(unixTimestamp * 1000);
    const time = dataObjek.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
    const date = dataObjek.toLocaleDateString('id-ID', {weekday: 'short', month: 'short', day: 'numeric'});

    return  `  
                    <p class="data">${date} <br> ${time} <br> <br><span class="temp">${Math.round(data.main.temp)} <span class="celcius">&deg C</span></span></p>
                    <img class="card" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
            `;
}

