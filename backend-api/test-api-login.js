const axios = require('axios');

async function testLogin() {
  const baseUrl = 'http://localhost:3000/api/v1';
  
  console.log('🔍 Testando login via API HTTP...\n');
  
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, {
      email: 'gustavobressanin6@gmail.com',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login bem sucedido!');
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Erro no login:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
      console.log('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.log('Sem resposta do servidor. O backend está rodando?');
      console.log('Error:', error.message);
    } else {
      console.log('Erro:', error.message);
    }
  }
}

testLogin();
