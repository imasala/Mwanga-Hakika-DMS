from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("documents", "0022_document_department_document_expiry_date_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="allowed_groups",
            field=models.ManyToManyField(
                blank=True,
                related_name="accessible_documents",
                to="auth.group",
                verbose_name="allowed groups",
            ),
        ),
        migrations.AddField(
            model_name="document",
            name="allowed_roles",
            field=multiselectfield.db.fields.MultiSelectField(
                blank=True,
                choices=[
                    ("ADMIN", "Admin"),
                    ("HEAD", "Head"),
                    ("MANAGER", "Manager"),
                    ("ASSISTANT_MANAGER", "Assistant Manager"),
                    ("SENIOR_OFFICER", "Senior Officer"),
                    ("OFFICER", "Officer"),
                ],
                max_length=255,
                verbose_name="allowed roles",
            ),
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
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
            ],
        ),
    ]
