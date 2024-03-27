use cfg_if::cfg_if;
use rand::Rng;
use wasm_bindgen::prelude::*;

pub mod locales;
use locales::*;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

fn range(limit: usize) -> usize {
    rand::thread_rng().gen_range(0..limit)
}

#[wasm_bindgen(js_name = firstName)]
pub fn firstname(locale: Option<String>) -> String {
    let index = match locale.as_deref() {
        Some("FA") => range(FA::FIRST_NAME.len()),
        _ => range(EN::FIRST_NAME.len()),
    };

    match locale.as_deref() {
        Some("FA") => FA::FIRST_NAME[index].to_string(),
        _ => EN::FIRST_NAME[index].to_string(),
    }
}

#[wasm_bindgen(js_name = lastName)]
pub fn lastname(locale: Option<String>) -> String {
    let index = match locale.as_deref() {
        Some("FA") => range(FA::LAST_NAME.len()),
        _ => range(EN::LAST_NAME.len()),
    };

    match locale.as_deref() {
        Some("FA") => FA::LAST_NAME[index].to_string(),
        _ => EN::LAST_NAME[index].to_string(),
    }
}
