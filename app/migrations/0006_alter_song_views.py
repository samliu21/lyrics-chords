# Generated by Django 3.2.5 on 2021-07-21 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_song_views'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='views',
            field=models.TextField(default=''),
        ),
    ]
