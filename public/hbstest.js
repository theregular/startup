const Handlebars = require('handlebars');
const fs = require('fs');

// Get the template source
const templateSource = fs.readFileSync('hbstest.html', 'utf8');

// Compile the template
const template = Handlebars.compile(templateSource);

// Define the data object
const data = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  location: 'New York',
  profilePic: 'https://example.com/profile-pic.jpg'
};

// Render the template with data
const html = template(data);

// Display the rendered template on the page
const container = document.querySelector('#profile-container');
container.innerHTML = html;