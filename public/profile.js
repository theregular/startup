const handlebars = require('handlebars');

const templateSource = document.querySelector('#profile-template').innerHTML;
const template = Handlebars.compile(templateSource);

const data = {
    //replace with DB data later

    username: 'jesuslover123'


}

const html = template(data);
const container = document.querySelector('#profile-container');
container.innerHTML = html;

