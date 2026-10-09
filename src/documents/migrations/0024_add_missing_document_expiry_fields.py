
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0023_document_allowed_groups_document_allowed_roles_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="expiry_date",
            field=models.DateField(
                blank=True,
                db_index=True,
                help_text="The expiry date of the document.",
                null=True,
                verbose_name="expiry date",
            ),
        ),
        migrations.AddField(
            model_name="document",
            name="status",
            field=models.CharField(
                choices=[
                    ("active", "Active"),
                    ("pending", "Pending"),
                    ("expired", "Expired"),
                    ("revoked", "Revoked"),
                ],
                db_index=True,
                default="pending",
                max_length=20,
                verbose_name="status",
            ),
        ),
    ]
