# Generated by Django 3.2.5 on 2021-07-21 19:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_song_views'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='is_favourite',
            field=models.BooleanField(default=False),
        ),
    ]
