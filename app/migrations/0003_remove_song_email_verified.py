# Generated by Django 3.2.5 on 2021-07-18 16:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_song_email_verified'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='song',
            name='email_verified',
        ),
    ]