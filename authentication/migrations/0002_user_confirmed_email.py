# Generated by Django 3.2.5 on 2021-07-18 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='confirmed_email',
            field=models.BooleanField(default=False),
        ),
    ]
