
const url = 'https://ktxhtyiosvdahmvzhxpl.supabase.co/rest/v1/user_progress?select=*&limit=1';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eGh0eWlvc3ZkYWhtdnpoeHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDQyNTcsImV4cCI6MjA5MDcyMDI1N30.RWbfLwQCff6QocNEJ8UXsrSofL8uYD7QL3PRu5ShtJk';

fetch(url, {
  method: 'GET',
  headers: {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`
  }
})
.then(res => {
  if (res.status === 404) {
    console.log('Table user_progress does NOT exist');
  } else if (res.status === 200) {
    console.log('Table user_progress exists');
  } else {
    res.json().then(j => console.log('Response status:', res.status, 'Body:', j));
  }
})
.catch(err => console.log('Error:', err.message));
