const API = 'https://api.sampleapis.com/wines/';
const wrapper = document.querySelector('.wrapper')
const nav = document.querySelector('.nav');
const search = document.querySelector('.search');
const searchInput = document.querySelector('.search input');
const edit = document.querySelector('.edit-form');
const add = document.querySelector('.add-form');
const editBtn = document.querySelector('.edit__btn');
const addBtn = document.querySelector('.add__btn');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');

const editTitle = edit.querySelector('input#title');
const editImage = edit.querySelector('input#image');
const editWinery = edit.querySelector('input#winery');
const editLocation = edit.querySelector('input#location');
const editAverage = edit.querySelector('input#average');
const editReviews = edit.querySelector('input#reviews');

const addTitle = add.querySelector('input#addtitle');
const addImage = add.querySelector('input#addimage');
const addWinery = add.querySelector('input#addwinery');
const addLocation = add.querySelector('input#addlocation');
const addAverage = add.querySelector('input#addaverage');
const addReviews = add.querySelector('input#addreviews');
const chooseSort = add.querySelector('select');

const toggleForm = document.querySelector('.toggle-form');


toggleForm.addEventListener('click', ({}) => {
  add.classList.toggle('show');
})

addTitle.addEventListener('change', (e) => { state.newWine.wine = e.target.value })
addImage.addEventListener('change', (e) => { state.newWine.image = e.target.value })
addWinery.addEventListener('change', (e) => { state.newWine.winery = e.target.value })
addLocation.addEventListener('change', (e) => { state.newWine.location = e.target.value })
addAverage.addEventListener('change', (e) => { state.newWine.rating.average = e.target.value })
addReviews.addEventListener('change', (e) => { state.newWine.rating.reviews = e.target.value })
chooseSort.addEventListener('change', (e) => { sort.type = e.target.value});


editTitle.addEventListener('change', (e) => { state.editableWine.wine = e.target.value })
editImage.addEventListener('change', (e) => { state.editableWine.image = e.target.value })
editWinery.addEventListener('change', (e) => { state.editableWine.winery = e.target.value })
editLocation.addEventListener('change', (e) => { state.editableWine.location = e.target.value })
editAverage.addEventListener('change', (e) => { state.editableWine.rating.average = e.target.value })
editReviews.addEventListener('change', (e) => { state.editableWine.rating.reviews = e.target.value})

addBtn.addEventListener('click', async () => {
  if (!state.newWine.wine || !state.newWine.winery || !sort.type){
    console.log('Fill all nessesary fields: wine/winery/type')
  } else {  
    await postData(sort.type);
    clearNewData();
    fillWines(state.cards);
  }

})

const sort = {
  type: ''
}

const state = {
  cards: [],
  type: '',
  newWine: {
    wine: '',
    image: '',
    winery: '',
    location: '',
    rating: {
      average: '',
      reviews: ''
    },
  },
  editableWine: {
  }
};

const deleteWineCard = (index) => {
  const wineCardToDelete = state.cards[index];
  if (!state.type){
    deleteData(sort.type, wineCardToDelete.id);
  } else {
    deleteData(state.type, wineCardToDelete.id);
  }
  

  state.cards.splice(index, 1);
  fillWines(state.cards);
}

const getWinesBtn = () => {
  nav.addEventListener('click', async ({target}) => {
    if (target && target.classList.contains('nav__btn')){
      await getData(target.dataset.type);
      fillWines(state.cards);
      search.style.display = 'block';
      searchInput.value = '';
    }
  })
  
}

const getSearched = () => {
  searchInput.addEventListener('change', async ({target}) => {
    await getData(state.type);
    let str = target.value;
    let res = state.cards.filter(item => item.wine.toLowerCase().includes(str));
    state.cards = res;
    fillWines(res);
  })
}


const editWineCard = (index) => {
  edit.style.display = 'flex'; 
  openModal(index);
};




const openModal = (index) => {
  clearModalData();
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  state.editableWine = state.cards[index];
  editTitle.value = state.editableWine.wine;
  editImage.value = state.editableWine.image; 
  editWinery.value = state.editableWine.winery; 
  editLocation.value = state.editableWine.location; 
  editAverage.value = state.editableWine.rating.average; 
  editReviews.value = state.editableWine.rating.reviews;
}

const closeModal = () => {
  document.body.style.overflow = '';
  modal.classList.remove('show');
}

const clearNewData = () => {
  addTitle.value = '';
  addImage.value = '';
  addWinery.value = '';
  addLocation.value = '';
  addAverage.value = '';
  addReviews.value = '';
  chooseSort.value = null;
  state.newWine.wine = '';
  state.newWine.image = '';
  state.newWine.winery = '';
  state.newWine.location = '';
  state.newWine.rating.average = '';
  state.newWine.rating.reviews = '';
}

const clearModalData = () => {
  editableWine = {};
  editTitle.value = '';
  editImage.value = ''; 
  editWinery.value = ''; 
  editLocation.value = ''; 
  editAverage.value = ''; 
  editReviews.value = '';
}

modal.addEventListener('click', ({target}) => {
  if (target.closest('.modal__close') || target.classList.contains('modal')){
    closeModal();
  }
})


editBtn.addEventListener('click', async () => {
  closeModal();
  await editData(state.type);
  fillWines(state.cards);
})


const renderWines = ( { id, wine, winery, image, location, rating } , index) => {
  const card = document.createElement('div')
  card.classList.add('card__item');
  card.id = id;
  card.innerHTML = 
  `
      <div class="wine">${wine}</div>
      <img src="${image ? image : '#'}" alt="${wine}" loading="lazy">
      <div class="descr">
        <div class="info winery"><span class="label">winery: </span>${winery}</div>
        <div class="info location"><span class="label">location: </span>${location}</div>
        <div class="info rating">
          <span class="info average"><span class="label">average: </span>${rating.average}</span>
          <span class="info reviews"><span class="label">reviews: </span>${rating.reviews}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn edit" onclick="editWineCard(${index})">Edit</button>
        <button class="btn delete" onclick="deleteWineCard(${index})">Delete</button>
      </div>
      
  `
  wrapper.append(card);
}


const fillWines = (data) => {

  wrapper.innerHTML = '';
  if (data.length) {
    // data.forEach(( item, index) => renderWines(item, index));
    for (let i = 0; i < data.length; i++){
      renderWines(data[i], i)
    }
  }
}


const getData = async (url) => {
  try {
    const response = await fetch(`${API}${url}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      }
    });
    const data = await response.json();
    state.cards = [];
    state.cards = state.cards.concat(data);
    state.type = url;
  } 
  catch(err){
    console.error('Error: ', err);
  }
}

const postData = async (url) => {
  try {
    const response = await fetch(`${API}${url}`, {
      method: 'POST',
      body: JSON.stringify(state.newWine),
      headers: {
        "Content-type": "application/json"
      }
    });
    const data = await response.json();
    state.cards.push(data);
    console.log('state.cards: ', state.cards);
  } 
  catch(err){
    console.error('Error: ', err);
  }
}


const editData = async (url) => {
  try {
    const response = await fetch(`${API}${url}/${state.editableWine.id}`, {
      method: 'PUT',
      body: JSON.stringify(state.editableWine),
      headers: {
        "Content-type": "application/json"
      }
    });
    const data = await response.json();
  } 
  catch(err){
    console.error('Error: ', err);
  }
}


const deleteData = async (url, id) => {
  try {
    const response = await fetch(`${API}${url}/${id}`, {
      method: 'DELETE',
    });
  } 
  catch(err){
    console.error('Error: ', err);
  }
}


getWinesBtn();
getSearched();