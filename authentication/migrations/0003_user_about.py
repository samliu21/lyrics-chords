# Generated by Django 3.2.5 on 2021-08-01 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_user_confirmed_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='about',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
    ]
