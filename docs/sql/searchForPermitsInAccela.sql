
SELECT 'Minor' AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, '') = '' THEN ''
            ELSE a.applicant_name
        END AS name
   FROM amd.permits a

  WHERE a.permit_group = 'Planning' AND a.permit_type = 'Development' AND a.permit_subtype = 'Level I'
UNION
 SELECT 'Major' AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, '') = '' THEN ''
            ELSE a.applicant_name
        END AS name
   FROM amd.permits a

  WHERE a.permit_group = 'Planning' AND (a.permit_type = 'Subdivision' AND a.permit_subtype = 'Major' OR a.permit_type = 'Development' AND (a.permit_subtype IN ('Level II', 'Level III', 'Conditional Zoning', 'Conditional Use')))
  UNION
 SELECT 'Affordable' AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, '') = '' THEN ''
            ELSE a.applicant_name
        END AS name
   FROM amd.permits a
     JOIN amd.permit_custom_fields permit_custom_fields ON a.permit_num = permit_custom_fields.permit_num
  WHERE permit_custom_fields.name like '%Affordable%' AND permit_custom_fields.value = 'Yes'
UNION
 SELECT 'Slope' AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, '') = '' THEN ''
            ELSE a.applicant_name
        END AS name
   FROM amd.permits a
     JOIN amd.permit_custom_fields permit_custom_fields ON a.permit_num = permit_custom_fields.permit_num
  WHERE permit_custom_fields.name like '%Steep Slope%' AND permit_custom_fields.value = 'Yes'

  order by applied_date desc