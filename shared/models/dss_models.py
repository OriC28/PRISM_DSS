# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AccionesMitigacion(models.Model):
    mitigacion_id = models.AutoField(primary_key=True)
    nombre_mitigacion = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'acciones_mitigacion'


class Categorias(models.Model):
    categoria_id = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=85)

    class Meta:
        managed = False
        db_table = 'categorias'


class CategoriasRiesgos(models.Model):
    riesgo = models.ForeignKey('Riesgos', models.DO_NOTHING, db_column='riesgo')
    categoria = models.ForeignKey(Categorias, models.DO_NOTHING, db_column='categoria')

    class Meta:
        managed = False
        db_table = 'categorias_riesgos'


class Proyectos(models.Model):
    proyecto_id = models.AutoField(primary_key=True)
    nombre_proyecto = models.CharField(max_length=255)
    tipo_proyecto = models.ForeignKey('TipoProyecto', models.DO_NOTHING, db_column='tipo_proyecto')
    estado_proyecto = models.CharField(max_length=45)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    presupuesto = models.FloatField()
    moneda = models.CharField(max_length=15)
    duracion_estimada = models.IntegerField()
    unidad_duracion = models.CharField(max_length=15)
    cantidad_equipo = models.IntegerField()
    ubicacion_geografica = models.CharField(max_length=150)
    fecha_creacion = models.DateField()

    class Meta:
        managed = False
        db_table = 'proyectos'


class Riesgos(models.Model):
    riesgo_id = models.AutoField(primary_key=True)
    nombre_riesgo = models.CharField(max_length=85)
    estado_riesgo = models.CharField(max_length=85)
    proyecto = models.ForeignKey(Proyectos, models.DO_NOTHING, db_column='proyecto')
    probabilidad = models.IntegerField()
    impacto = models.CharField(max_length=20)
    mitigacion = models.ForeignKey(AccionesMitigacion, models.DO_NOTHING, db_column='mitigacion')

    class Meta:
        managed = False
        db_table = 'riesgos'


class TipoProyecto(models.Model):
    tipo_proyecto_id = models.AutoField(primary_key=True)
    nombre_tipo = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'tipo_proyecto'
