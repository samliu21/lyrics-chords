# Generated by Django 3.2.5 on 2021-07-28 15:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_alter_comment_reply_to'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='reply_to',
            new_name='parent',
        ),
    ]
