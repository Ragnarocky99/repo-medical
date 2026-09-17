create or replace function estado_remision(p_id_remision in number)
  return varchar2 is
  vestado                  varchar2(10);
  v_cantidad_en_remision   number(9);
  v_cantidad_en_factura    number(9);
  v_cantidad_en_pendientes number(9);
  v_id_comprobante_cab     number(9);
begin

  -- Comprobar si esta anulado
  select c.estado
    into vestado
    from stw_entsal_cab c
   where c.id = p_id_remision;
  if vestado = 'A' then
    vestado := 'Anulado';
    return vestado;
  end if;

  -- Busca el comprobante asociado a la remision.
  <<buscar_comprobante>>
  begin
    select vc.id
      into v_id_comprobante_cab
      from vtw_comprobantes_cabecera vc
      join vtw_comprobantes_detalle vd
        on vd.id_comprobante_cabecera = vc.id
       and vd.id_remision = p_id_remision
     where rownum = 1;
  
  exception
    when no_data_found then
      -- Seguir condicion original 
      begin
        select count(*)
          into v_cantidad_en_remision
          from stw_entsal_det d
         where d.id_entsal_cab = p_id_remision;
      
        select count(*)
          into v_cantidad_en_pendientes
          from vtwv_facturar_remisiones rp
         where rp.ID_REMISION = p_id_remision;
      
        select case v_cantidad_en_pendientes
                 when v_cantidad_en_remision then
                  'Pendiente'
                 when 0 then
                  'Facturado'
                 else
                  'Parcial'
               end
          into vestado
          from dual;
      
        return(vestado);
      end;
    
  end buscar_comprobante;

  -- Contar los items de la factura.
  <<contar_items_factura>>
  begin
    select count(1)
      into v_cantidad_en_factura
      from vtw_comprobantes_detalle cd
     where cd.id_comprobante_cabecera = v_id_comprobante_cab;
  end contar_items_factura;

  -- Contar los items con remision.
  <<contar_items_con_remision>>
  begin
    select count(1)
      into v_cantidad_en_remision
      from vtw_comprobantes_detalle cd
     where cd.id_comprobante_cabecera = v_id_comprobante_cab
       and cd.id_remision is not null;
  end contar_items_con_remision;

  if v_cantidad_en_remision = v_cantidad_en_factura then
    vestado := 'Facturado';
  end if;

  if v_cantidad_en_factura > v_cantidad_en_remision and
     v_cantidad_en_remision > 0 then
    vestado := 'Parcial';
  end if;

  if v_cantidad_en_remision = 0 then
    vestado := 'Pendiente';
  end if;

  return(vestado);
end estado_remision;
/
