CREATE OR REPLACE VIEW internal.notification_emails
AS SELECT 'Minor'::text AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, ''::character varying)::text = ''::text THEN b.address_full
            ELSE a.applicant_name
        END AS name,
    b.longitude_wgs AS x,
    b.latitude_wgs AS y
   FROM internal.permits a
     LEFT JOIN internal.coa_bc_address_master b ON a.civic_address_id::text = b.civicaddress_id::character varying(50)::text
  WHERE a.permit_group::text = 'Planning'::text AND a.permit_type::text = 'Development'::text AND a.permit_subtype::text = 'Level I'::text
UNION
 SELECT 'Major'::text AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, ''::character varying)::text = ''::text THEN b.address_full
            ELSE a.applicant_name
        END AS name,
    b.longitude_wgs AS x,
    b.latitude_wgs AS y
   FROM internal.permits a
     LEFT JOIN internal.coa_bc_address_master b ON a.civic_address_id::text = b.civicaddress_id::character varying(50)::text
  WHERE a.permit_group::text = 'Planning'::text AND (a.permit_type::text = 'Subdivision'::text AND a.permit_subtype::text = 'Major'::text 
  OR a.permit_type::text = 'Development'::text AND (
      a.permit_subtype::text = ANY (ARRAY['Level II'::character varying::text, 'Level III'::character varying::text, 'Conditional Zoning'::character varying::text, 'Conditional Use'::character varying::text])))
UNION
 SELECT 'Affordable'::text AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, ''::character varying)::text = ''::text THEN b.address_full
            ELSE a.applicant_name
        END AS name,
    b.longitude_wgs AS x,
    b.latitude_wgs AS y
   FROM internal.permits a
     LEFT JOIN internal.coa_bc_address_master b ON a.civic_address_id::text = b.civicaddress_id::character varying(50)::text
     JOIN internal.permit_custom_fields ON a.permit_num::text = permit_custom_fields.permit_num::text
  WHERE permit_custom_fields.name::text ~~* '%Affordable%'::text AND permit_custom_fields.value::text = 'Yes'::text
UNION
 SELECT 'Slope'::text AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, ''::character varying)::text = ''::text THEN b.address_full
            ELSE a.applicant_name
        END AS name,
    b.longitude_wgs AS x,
    b.latitude_wgs AS y
   FROM internal.permits a
     LEFT JOIN internal.coa_bc_address_master b ON a.civic_address_id::text = b.civicaddress_id::character varying(50)::text
     JOIN internal.permit_custom_fields ON a.permit_num::text = permit_custom_fields.permit_num::text
  WHERE a.permit_group::text = 'Planning'::text AND (a.permit_type::text = 'Subdivision'::text AND a.permit_subtype::text = 'Major'::text 
  OR a.permit_type::text = 'Development'::text AND (
      a.permit_subtype::text = ANY (ARRAY['Level I'::character varying::text, 'Level II'::character varying::text, 'Level III'::character varying::text, 'Conditional Zoning'::character varying::text, 'Conditional Use'::character varying::text]))) 
      AND permit_custom_fields.name::text ~~* '%Steep Slope%'::text AND permit_custom_fields.value::text = 'Yes'::text
UNION
 SELECT 'Sound Exceedance'::text AS tag,
    a.permit_num,
    a.applied_date,
        CASE
            WHEN COALESCE(a.applicant_name, ''::character varying)::text = ''::text THEN b.address_full
            ELSE a.applicant_name
        END AS name,
    b.longitude_wgs AS x,
    b.latitude_wgs AS y
   FROM internal.permits a
     LEFT JOIN internal.coa_bc_address_master b ON a.civic_address_id::text = b.civicaddress_id::character varying(50)::text
  WHERE a.permit_group::text = 'Permits'::text AND a.permit_type::text = 'Commercial'::text AND a.permit_subtype::text = 'Existing Building'::text AND a.permit_category::text = 'Sound Exceedance'::text;