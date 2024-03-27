mod en;
mod fa;

pub trait FirstName {
    const EN: &'static [&'static str] = en::EN_FIRST_NAMES;
    const FA: &'static [&'static str] = fa::FA_FIRST_NAMES;
}

pub struct FakeFirstName;

impl FirstName for FakeFirstName {}
