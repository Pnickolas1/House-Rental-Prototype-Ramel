const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com',
		'X-RapidAPI-Key': '1d69d7893amsh788b07db274a5a5p1be532jsn3c7b30139e1d'
	}
};

// GET USER LOCATION WITH PERMISSION

if(navigator.geolocation){

	// GET COORDINATES AND GEOCODE TO CITY AND STATE

	navigator.geolocation.getCurrentPosition(async (position) => {
		const { longitude, latitude } = position.coords;
		console.log({longitude, latitude}, "$$$$");
		
		// GOOGLE API GEOCODE
		const location = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDS6NJFPO_mMQ0r2NBTDfdWjbU4URLgEUk`
		)
		.then(response => response.json());
		console.log({location })
    // THIS GETS CITY NAME 
    console.log('data: ', location.results[0])
		let city = location.results[0].address_components[3].long_name;
    // checkout how I wrapped the variable with brackets {}, do you see what that does in the console? It's a very helpful trick I use daily
		console.log({city})
				// THIS GET STATE NAME
		let state = location.results[0].address_components[5].short_name;
		console.log({ state })

    /*
      these geolocation are notoriously tricky, the return payloads of what you get from their API is not consistent!
      sometimes it will return a County name instead of the city
      sometime it will return a city name instead of the State 

      if you find yourself struggling with that, just set them as constants like this so you can keep moving! Don't get stuck on the mudd
      on small details like that! 
    */

    // state = IL
    // city = Chicago

const getProperty = async() => {
	console.log(city)
	// CITY AND STATE NAME GET PASSED INTO FETCH CALL
	const response = await fetch(`https://us-real-estate.p.rapidapi.com/for-sale?offset=0&limit=10&state_code=${state}&city=${city}&sort=relevant`, options)
	const data = await response.json();
  // UNCOMMENT THIS debugger and checkout what happens! be sure to have your dev tools open in chrome!
  // debugger
	let props = Object.entries(data.data.results)
	console.log('props', props)

  if (props.length >= 7) { // defensive coding!!
    for (let indexCounter = 1; indexCounter < 7; indexCounter ++) { // check out how I am using the indexCounter dynamically!
      // we're going to loop over the data and building these values dynamically! 
      // LOOK HOW MUCH CODE THAT SAVED US!
      let address = props[indexCounter][1].location.address.line
      console.log(address)
      let pCity = props[indexCounter][1].location.address.city
      let pState = props[indexCounter][1].location.address.state_code
      let pPostal = props[indexCounter][1].location.address.postal_code
      document.querySelector(`#prop-${indexCounter}-Add`).innerText = `${address}`;
      document.querySelector(`#prop-${indexCounter}-Loc`).innerText = `${pCity}, ${pState} ${pPostal}`

      // PICTURES
      let propPic = props[indexCounter][1].primary_photo.href;
      console.log(propPic);
      document.querySelector(`#prop-${indexCounter}-Pic`).src = `${propPic}`;


      // LET PRICES
      let propPrice = props[indexCounter][1].list_price;
      propPrice = propPrice.toLocaleString('en-US');
      console.log(propPrice);
      document.querySelector(`#prop-${indexCounter}-Price`).innerHTML = `$${propPrice}`;
    
      // BEDS
      let propBeds = props[2][1].description.beds;
      console.log(propBeds)
      document.querySelector(`#prop-${indexCounter}-Beds`).innerText = `${propBeds}`;
    
        // PROPERTY BATHS!!!
      let propBaths = props[2][1].description.baths
      console.log(propBaths)
      document.querySelector(`#prop-${indexCounter}-Baths`).innerText = `${propBaths}`
    }
  }
}
  getProperty()
});

}