//get username from local storage cookie //GET WORKING
/*(async () => {
    let authenticated = false;
    const userName = localStorage.getItem('username');

    //find stored username in DB
    if (userName) {
      const user = await getUser(userName);
      authenticated = user?.authenticated;
    }
    
    //if already in local storage redirect to user's page (add authtoken confirmation?)
    if (authenticated) {
      window.location.pathname = `/profile/${userName}`;
    }
    else {
      window.location.pathname = `/login`;
    }

  })();
*/
async function getProfile() {
    alert("CLICKED PROFILE");
    /*
    let authenticated = false;
    const userName = localStorage.getItem('username');

    //find stored username in DB
    if (userName) {
      const user = await getUser(userName);
      authenticated = user?.authenticated;
    }
    
    //if already in local storage redirect to user's page (add authtoken confirmation?)
    if (authenticated) {
      window.location.pathname = `/profile/${userName}`;
    }
    else {
      window.location.pathname = `/login`;
    }
    */
}

/*const handlebars = require('handlebars');

const templateSource = document.querySelector('#profile-template').innerHTML;
const template = Handlebars.compile(templateSource);

const data = {
    //replace with DB data later

    username: 'jesuslover123'


}

const html = template(data);
const container = document.querySelector('#profile-container');
container.innerHTML = html;
*/
