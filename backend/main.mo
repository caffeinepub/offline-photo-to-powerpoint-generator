import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type Photo = {
    image : Storage.ExternalBlob;
    locationName : Text;
  };
};
