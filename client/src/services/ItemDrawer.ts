import Item from "../models/Item";

interface DrawItemParams {
  item: Item;
  mapOffsetX: number;
  mapOffsetY: number;
  ctx: CanvasRenderingContext2D;
  img: HTMLImageElement;
}

class ItemDrawer {
  static drawItem(params: DrawItemParams): void {
    const { item, mapOffsetX, mapOffsetY, ctx, img } = params;
    ctx.drawImage(
      img,
      item.frameX * item.width,
      item.frameY * item.height,
      item.width,
      item.height,
      item.x * 64 + mapOffsetX,
      item.y * 64 + mapOffsetY,
      item.width * 4,
      item.height * 4
    );
  }
}

export default ItemDrawer;
