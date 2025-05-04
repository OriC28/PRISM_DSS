from django.test import TestCase, Client
from django.urls import reverse
from parameterized import parameterized


class IAResponse(TestCase):

    def setUp(self):
        self.client = Client()
    
    def test_valid_GET(self):
        response = self.client.get(reverse('show_form'))
        self.assertEqual(response.status_code, 200, 'El método GET debería realizarse correctamente.')

    def test_valid_POST(self):
        data = {
            'project_name': 'Proyecto1',
            'project_type': 'Residencial',
            'project_function': 'Salud',
            'estimate': '200000000',
            'time': '50',
            'project_description': 'proyecto para prueba.'
        }
        response = self.client.post(reverse('process_data'), data)
        self.assertEqual(response.status_code, 200, 'El método POST debería realizarse correctamente.')
    
    def test_invalid_POST(self):
        data = {
            'project_name': 'hoal313%%',
            'project_type': 'Residencial',
            'project_function': 'Salud',
            'estimate': '200000000',
            'time': '50',
            'project_description': 'proyecto para prueba.'
        }
        response = self.client.post(reverse('process_data'), data, format='json')
        self.assertEqual(response.status_code, 400, 'El método POST no debería realizarse correctamente.')
        response_data = response.json()
        self.assertIn('project_name', response_data['errors'])
        self.assertEqual(response_data['errors']['project_name'][0]['message'], 'Sólo se permiten letras, números y guiones.')





