export const buildLandingPage = (value: string): string => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple Landing Page</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f0f0f0;
              }
      
              header {
                  background-color: #333;
                  color: #fff;
                  text-align: center;
                  padding: 20px 0;
              }
      
              header h1 {
                  margin: 0;
              }
      
              .container {
                  max-width: 800px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
              }
      
              .container p {
                  line-height: 1.6;
              }
      
              .btn {
                  display: inline-block;
                  background-color: #333;
                  color: #fff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  transition: background-color 0.3s;
              }
      
              .btn:hover {
                  background-color: #555;
              }
          </style>
      </head>
      <body>
          <header>
              <h1>Welcome to Our Website value: ${value}</h1>
              <p>Your go-to destination for all things awesome!</p>
          </header>
      
          <div class="container">
              <h2>About Us</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor felis nec mauris congue, sed tristique tortor congue. Phasellus quis nunc id nisi mattis vestibulum. Nullam congue venenatis odio vel viverra.</p>
              <p>Curabitur auctor augue at posuere. Pellentesque tincidunt fringilla tellus. Donec vel felis eget enim vehicula iaculis. Integer vel laoreet nulla.</p>
              <a href="#" class="btn">Learn More</a>
          </div>
      
          <footer style="text-align: center; padding: 20px; background-color: #333; color: #fff;">
              &copy; 2023 Simple Landing Page
          </footer>
      </body>
      </html>
      `;
};
