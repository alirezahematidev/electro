use crate::locales::ElectroData;

#[allow(non_camel_case_types)]
#[derive(Copy, Clone)]
pub struct FA;

impl ElectroData for FA {
    const FIRST_NAME: &'static [&'static str] = FakeFirstName::FA;
    const LAST_NAME: &'static [&'static str] = FakeLastName::FA;
    const NOUNS: &'static [&'static str] = FakeWord::FA_NOUNS;
}

use self::{
    first_name::{FakeFirstName, FirstName},
    last_name::{FakeLastName, LastName},
    word::{FakeWord, Word},
};

use super::{first_name, last_name, word};
