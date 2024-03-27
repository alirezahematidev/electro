mod first_name;
mod last_name;
mod word;

#[cfg_attr(tool_attributes, rustfmt_skip)]
pub trait ElectroData {
    const FIRST_NAME: &'static [&'static str] = FakeFirstName::EN;
    const LAST_NAME: &'static [&'static str] = FakeLastName::EN;
    const NOUNS: &'static [&'static str] = FakeWord::EN_NOUNS;
}

pub mod en;
pub mod fa;

pub use self::{en::EN, fa::FA};

use first_name::*;
use last_name::*;
use word::*;
