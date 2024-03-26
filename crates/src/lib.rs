use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

pub mod locales;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn name3() -> String {
    let name: String = "gholi".to_string();
    name
}
