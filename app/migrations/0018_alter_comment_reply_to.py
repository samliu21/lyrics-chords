# Generated by Django 3.2.5 on 2021-07-28 14:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_comment_reply_to'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='reply_to',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.comment'),
        ),
    ]
