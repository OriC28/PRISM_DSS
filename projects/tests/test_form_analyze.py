from django.test import TestCase
from ..forms import FormAnalyze
from parameterized import parameterized

# Create your tests here.

class FormAnalyzeTest(TestCase):

    # Form validation tests
    def test_form_valid(self):
        form_data = {
            'project_name': 'Condominios Las Brisas',
            'project_type': 'Residencial',
            'project_function': 'Viviendas multifamiliares',
            'estimate': 2000000,
            'time': 36,
            'project_description': 'Condominios de lujo en la playa con piscina y gimnasio.'
        }

        form = FormAnalyze(data=form_data)
        self.assertTrue(form.is_valid(), 'El formulario debería ser válido')

    def test_form_invalid(self):
        form_data = {
            'project_name': '',
            'project_type': 'Residencial',
            'project_function': 'Viviendas multifamiliares',
            'estimate': '2000000',
            'time': 36,
            'project_description': 'Condominios de lujo en la playa con piscina y gimnasio.'
        }
        form = FormAnalyze(data=form_data)
        self.assertFalse(form.is_valid(), 'El formulario no debería ser válido')
    
    def test_form_is_empty(self):
        form = FormAnalyze(data={})
        self.assertFalse(form.is_valid(), 'El formulario no debería ser válido cuando está vacío')
        self.assertEqual(len(form.errors), 6, 'El formulario debería tener 6 errores cuando está vacío')
    
    def test_form_has_fields(self):
        form = FormAnalyze()
        expected_fields = [
            'project_name',
            'project_type',
            'project_function',
            'estimate',
            'time',
            'project_description'
        ]
        current_fields = form.fields.keys()
        self.assertEqual(set(expected_fields), set(current_fields), 'El formulario no tiene los campos esperados') 
    
    # Fields validation tests 
    """ @parameterized.expand([
        ('Campo vacío', {'project_name': ''}, True),
        ('Tipo numérico', {'project_name': 12345}, True),
        ('Longitud máxima', {'project_name': 'x'*256}, True),
        ('Longitud exacta', {'project_name': 'x'*255}, True),
        ('Caso válido', {'project_name': 'Condominios Las Brisas'}, False)
    ])

    def test_project_name(self, name, form_data, expected):
        form = FormAnalyze(data=form_data)
        if expected:
            self.assertFalse(form.is_valid())
            self.assertIn('project_name', form.errors)
        else:
            self.assertTrue(form.is_valid(), 'El nombre del proyecto debería ser válido')

    @parameterized.expand([
        ('Campo vacío', {'project_type': ''}, True),
        ('Tipo numérico', {'project_type': 12345}, True),
        ('Opction inválida', {'project_type': 'Internacional'}, True),
        ('Caso válido', {'project_type': 'Residencial'}, False)
    ])
    def test_project_type(self, name, form_data, expected):
        form = FormAnalyze(data=form_data)
        if expected:
            self.assertFalse(form.is_valid())
        else:
            self.assertTrue(form.is_valid(), 'El tipo de proyecto debería ser válido')
    
    @parameterized.expand([
        ('Campo vacío', {'project_function': ''}, True),
        ('Tipo numérico', {'project_function': 12345}, True),
        ('Caso válido', {'project_function': 'Viviendas multifamiliares'}, False)
    ])
    def test_project_function(self, name, form_data, expected):
        form = FormAnalyze(data=form_data)
        if expected:
            self.assertFalse(form.is_valid())
        else:
            self.assertTrue(form.is_valid(), 'La función del proyecto debería ser válida')

    @parameterized.expand([
        ('Campo vacío', {'estimate': ''}, True),
        ('Tipo numérico', {'estimate': 'abc'}, True),
        ('Número negativo', {'estimate': -5}, True),
        ('Numero cero', {'estimate': 0}, True),
        ('Número muy pequeño', {'estimate': 10}, True),
        ('Caso válido', {'estimate': 2000000}, False)
    ])
    def test_estimate(self, name, form_data, expected):
        form = FormAnalyze(data=form_data)
        if expected:
            self.assertFalse(form.is_valid())
        else:
            self.assertTrue(form.is_valid(), 'El presupuesto debería ser válido')

    @parameterized.expand([
        ('Campo vacío', {'time': ''}, True),
        ('Tipo numérico', {'time': 'abc'}, True),
        ('Número negativo', {'time': -5}, True),
        ('Numero cero', {'time': 0}, True),
        ('Número decimal', {'time': 36.5}, True),
        ('Número muy grande', {'time': 1000000}, True),
        ('Caso válido', {'time': 36}, False)
    ])
    def test_time(self, name, form_data, expected):
        form = FormAnalyze(data=form_data)
        if expected:
            self.assertFalse(form.is_valid())
        else:
            self.assertTrue(form.is_valid(), 'El tiempo debería ser válido')

    @parameterized.expand([
        ('Campo vacío', {'project_description': ''}, True),
        ('Tipo numérico', {'project_description': 12345}, True),
        ('Longitud máximo', {'project_description': 'x'*256}, True),
        ('Longitud exacta', {'project_description': 'x'*255}, True),
        ('Caso válido', {'project_description': 'Condominios de lujo en la playa con piscina y gimnasio.'}, False)
    ])
    def test_project_description(self, name, form_data, expected):
        form = FormAnalyze(data=form_data)
        if expected:
            self.assertFalse(form.is_valid())
        else:
            self.assertTrue(form.is_valid(), 'La descripción del proyecto debería ser válida') """