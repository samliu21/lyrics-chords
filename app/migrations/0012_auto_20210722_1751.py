# Generated by Django 3.2.5 on 2021-07-22 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_remove_song_views'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='artist',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='song',
            name='name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
