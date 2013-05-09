Tekpub.DescriptiveName = function(){
  return function(item){
    var out = item.id;
    if(item.name)
      out = item.name;
    else if (item.sku)
      out= item.sku;
    else if (item.slug)
      out= item.slug;
    else if (item.title)
      out= item.title;
    else if (item.email)
      out= item.email;
    return out;
  }
}