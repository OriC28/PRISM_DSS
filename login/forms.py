from django.core.validators import RegexValidator
from django.forms import forms,CharField,TextInput,PasswordInput
from django.contrib.auth.models import User
class LoginForm (forms.Form):
    username = CharField(
        label="Nombre de Usuario",
        required=True,
        min_length=1,
        max_length=150,
        validators=[
            RegexValidator(
                regex = r'^[a-zA-ZäÄëËïÏöÖüÜáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9@.+_\-\s]+$', 
                message="Sólo se permiten letras, números y los siguientes carácteres: @ . + - _ .")
        ],
        widget=TextInput(attrs={'placeholder': 'Ingrese su nombre de usuario.'}),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'El nombre de usuario no puede exceder los 150 carácteres',
            'min_length': 'El nombre de usuario debe tener al menos 3 carácteres'
        }
    )
    password = CharField(
        label="Contraseña",
        required=True,
        min_length=8,
        max_length=128,
        widget=PasswordInput(attrs={'placeholder': '••••••••'}),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La contraseña no puede exceder los 128 carácteres',
            'min_length': 'La contraseña debe tener al menos 8 carácteres'
        }
    )
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise forms.ValidationError("Este campo es obligatorio.")
        if username and not User.objects.filter(username=username).exists():
            raise forms.ValidationError("Usuario inexistente.")
        return username
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if not password:
            self.add_error('password', 'Este campo es obligatorio.')
        
        if not username or not password:
            raise forms.ValidationError("Ambos campos son obligatorios.")
        
        return cleaned_data